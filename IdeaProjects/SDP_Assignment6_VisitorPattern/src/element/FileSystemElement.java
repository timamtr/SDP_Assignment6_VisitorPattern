package element;

import visitor.Visitor;

public interface FileSystemElement {
    String getName();
    void accept(Visitor visitor);
}